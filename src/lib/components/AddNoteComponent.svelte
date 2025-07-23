<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { doc, setDoc, collection, increment } from "firebase/firestore";

    let noteTitle: string = $state("");
    let noteContent: string = $state("");

    async function addNote() {
        if (!$user) {
            console.error("User not authenticated");
            return;
        }
        const newNoteRef = doc(collection(db, "users", $user.uid, "notes"));

        const userDocRef = doc(db, "users", $user.uid);
        await setDoc(newNoteRef, {
            title: noteTitle,
            content: noteContent,
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
    }

    function showAddNoteDialog() {
        let addNoteDialog = document.getElementById(
            "add-note-dialog",
        ) as HTMLDialogElement;
        addNoteDialog.showModal();
    }
</script>

<button class="btn btn-warning flex-1" onclick={showAddNoteDialog}>
    Add Note
    <img class="w-[16px] h-[16px]" src="src\lib\img\add.png" alt="" />
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
                class="w-80 flex flex-row items-center justify-center gap-4 mb-5"
            >
                <span>Person</span>
                <select
                    required
                    bind:value={noteTitle}
                    class="select select-warning focus:outline-none cursor-pointer"
                >
                    <option selected>Beide</option>
                    <option>Jonas</option>
                    <option>Julia</option>
                </select>
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
