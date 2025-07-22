<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { collection, onSnapshot, doc, deleteDoc, increment, setDoc } from "firebase/firestore";

    interface Note {
        id: string;
        title: string;
        content: string;
    }

    let notes: Note[] = $state([]);
    let notesCreatedCount = $state(0);

    $effect(() => {
        if ($user) {
            const notesCollection = collection(db, "users", $user.uid, "notes");
            const unsubscribeNotes = onSnapshot(notesCollection, (querySnapshot) => {
                notes = querySnapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() } as Note;
                });
            });
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

{#if notesCreatedCount > 0}
    <progress
        class="progress progress-accent w-56"
        value={doneCount}
        max={notesCreatedCount}
    ></progress>
    <p>{doneCount} / {notesCreatedCount} Notes done</p>
{/if}

{#if notes.length > 0}
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {#each notes as note (note.id)}
            <div class="{note.title === 'Jonas' ? 'bg-blue-300' : 'bg-pink-300'} p-4 rounded-lg shadow-md flex flex-col">
                <h3 class="font-bold text-lg mb-2">{note.title}</h3>
                <p class="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                <button
                    class="btn btn-danger"
                    onclick={() => deleteNote(note.id)}>Done</button
                >
            </div>
        {/each}
    </div>
{:else}
    <div class="w-full flex justify-center items-center">
        <p>No notes found. Add a new one to get started!</p>
    </div>
{/if}
