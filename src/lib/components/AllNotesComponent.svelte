<script lang="ts">
    import { db, user } from "$lib/firebase";
    import {
        collection,
        onSnapshot,
        doc,
        deleteDoc,
        increment,
        setDoc,
    } from "firebase/firestore";
    import AnimatedComponent from "./AnimatedComponent.svelte";
    interface Note {
        id: string;
        title: string;
        content: string;
        deadline: string;
    }

    let notes: Note[] = $state([]);
    let notesCreatedCount = $state(0);

    $effect(() => {
        if ($user) {
            const notesCollection = collection(db, "users", $user.uid, "notes");
            const unsubscribeNotes = onSnapshot(
                notesCollection,
                (querySnapshot) => {
                    notes = querySnapshot.docs
                        .map((doc) => {
                            return { id: doc.id, ...doc.data() } as Note;
                        })
                        .sort((a, b) => {
                            const dateA = a.deadline
                                .split(".")
                                .reverse()
                                .join("");
                            const dateB = b.deadline
                                .split(".")
                                .reverse()
                                .join("");
                            return dateA.localeCompare(dateB);
                        });
                },
            );
            const userDocRef = doc(db, "users", $user.uid);
            const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
                notesCreatedCount = docSnap.data()?.notesCreated || 0;
            });
            return () => {
                unsubscribeNotes();
                unsubscribeUser();
            };
        } else {
            notes = [];
            notesCreatedCount = 0;
        }
    });

    async function deleteNote(noteId: string) {
        if (!$user) {
            console.error("User not authenticated");
            return;
        }
        const noteRef = doc(db, "users", $user.uid, "notes", noteId);
        await deleteDoc(noteRef);
    }

    let doneCount = $derived(notesCreatedCount - notes.length);

    $effect(() => {
        if ($user && notes.length === 0 && notesCreatedCount > 0) {
            const userDocRef = doc(db, "users", $user.uid);
            setDoc(userDocRef, { notesCreated: 0 }, { merge: true });
        }
    });
</script>

<div class="w-full h-[50px]">
    {#if notesCreatedCount > 0}
        <AnimatedComponent>
            <progress
                class="progress progress-accent w-56"
                value={doneCount}
                max={notesCreatedCount}
            ></progress>
            <p>{doneCount} / {notesCreatedCount} Notes done</p>
        </AnimatedComponent>
    {/if}
</div>
<div class="flex-1 overflow-y-auto w-full">
    {#if notes.length > 0}
        <div
            class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
        >
            {#each notes as note (note.id)}
                <div>
                    <AnimatedComponent>
                        <div
                            class="{note.title === 'Jonas'
                                ? 'bg-blue-300'
                                : note.title === 'Julia'
                                  ? 'bg-pink-300'
                                  : 'bg-orange-300'} p-4 rounded-lg shadow-md flex flex-col h-[230px] justify-center w-full"
                        >
                            <div
                                class="flex flex-col items-start justify-start flex-1 min-h-0"
                            >
                                <div
                                    class="w-full flex flex-row items-center justify-between mb-2"
                                >
                                    <h3 class="font-bold text-lg">
                                        {note.title}
                                    </h3>
                                    <p class="text-m">
                                        {note.deadline}
                                    </p>
                                </div>
                                <p
                                    class="text-gray-700 whitespace-pre-wrap overflow-auto w-full"
                                >
                                    {note.content}
                                </p>
                            </div>
                            <button
                                aria-label="Mark as done"
                                class="btn btn-danger btn-circle check-mark-white dark:bg-[url('/src/lib/img/checkMarkWhite.png')] bg-center bg-no-repeat w-8 h-8 mt-2 bg-[url('/src/lib/img/checkMarkBlack.png')]"
                                onclick={() => deleteNote(note.id)}
                            ></button>
                        </div>
                    </AnimatedComponent>
                </div>
            {/each}
        </div>
    {:else}
        <div class="w-full flex justify-center items-center">
            <p>No notes found. Add a new one to get started!</p>
        </div>
    {/if}
</div>
