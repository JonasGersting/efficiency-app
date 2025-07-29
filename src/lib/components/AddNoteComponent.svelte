<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { doc, setDoc, collection, increment } from "firebase/firestore";
    import { onMount } from "svelte";
    import addIcon from "$lib/img/add.png"; 

    onMount(() => {
        import("cally");
    });
    let noteTitle: string = $state("Beide");
    let noteContent: string = $state("");
    let noteDeadline: string = $state("");

    async function addNote() {
        if (!$user) {
            console.error("User not authenticated");
            return;
        }
        const newNoteRef = doc(collection(db, "users", $user.uid, "notes"));

        const userDocRef = doc(db, "users", $user.uid);
        const dateParts = noteDeadline.split("-");
        const formattedDeadline = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
        await setDoc(newNoteRef, {
            title: noteTitle,
            content: noteContent,
            deadline: formattedDeadline,
        });

        await setDoc(
            userDocRef,
            {
                notesCreated: increment(1),
            },
            { merge: true },
        );
        noteTitle = "";
        noteContent = "";
        noteDeadline = "";
    }

    function showAddNoteDialog() {
        let addNoteDialog = document.getElementById(
            "add-note-dialog",
        ) as HTMLDialogElement;
        addNoteDialog.showModal();
    }

    function handleDateChange(event: CustomEvent) {
        const target = event.target as any;
        noteDeadline = target._props.value;
    }

    function callyEvents(node: HTMLElement) {
        const handleChange = (event: Event) => {
            handleDateChange(event as CustomEvent);
        };
        node.addEventListener("change", handleChange);
        return {
            destroy() {
                node.removeEventListener("change", handleChange);
            },
        };
    }
</script>

<button class="btn btn-warning flex-1" onclick={showAddNoteDialog}>
    Add Note
    <img class="w-[16px] h-[16px] ml-[8px]" src={addIcon} alt="Add Note" />
</button>
<dialog id="add-note-dialog" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box flex flex-col items-center">
        <h2 class="mb-32 text-3xl">Add Note</h2>
        <form
            method="dialog"
            class="w-80 flex flex-col items-center justify-center gap-4"
            onsubmit={addNote}
        >
            <div
                class="w-80 flex flex-row items-center justify-between gap-4 mb-5"
            >
                <span>Person</span>
                <select
                    required
                    bind:value={noteTitle}
                    class="select select-warning max-w-48 w-full focus:outline-none cursor-pointer"
                >
                    <option>Beide</option>
                    <option>Jonas</option>
                    <option>Julia</option>
                </select>
            </div>
            <div
                class="w-full flex flex-row items-center justify-between gap-4 mb-5"
            >
                <span>Deadline</span>
                <button
                    type="button"
                    popovertarget="cally-popover1"
                    class="select select-warning max-w-48 w-full focus:outline-none cursor-pointer"
                    id="cally1"
                    style="anchor-name:--cally1"
                >
                    {noteDeadline || "Select Date"}
                </button>
                <div
                    popover
                    id="cally-popover1"
                    class="dropdown bg-base-100 rounded-box shadow-lg"
                    style="position-anchor:--cally1"
                >
                    <calendar-date class="cally" use:callyEvents>
                        <div slot="previous">
                            <svg
                                aria-label="Previous"
                                class="fill-current size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                ><path d="M15.75 19.5 8.25 12l7.5-7.5"
                                ></path></svg
                            >
                        </div>
                        <div slot="next">
                            <svg
                                aria-label="Next"
                                class="fill-current size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                ><path d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                ></path></svg
                            >
                        </div>

                        <calendar-month></calendar-month>
                    </calendar-date>
                </div>
            </div>
            <textarea
                required
                bind:value={noteContent}
                placeholder="Note"
                class="break-words resize-none h-[300px] textarea textarea-warning focus:outline-none"
            >
            </textarea>
            <div class="w-full">
                <button type="submit" class="btn btn-warning w-full">Add</button
                >
            </div>
        </form>
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-[32px] top-[32px]"
                >✕</button
            >
        </form>
    </div>
</dialog>

<style>
    @media (max-width: 640px) {
        #cally-popover1 {
            transform: translateX(-26%);
        }
    }
</style>