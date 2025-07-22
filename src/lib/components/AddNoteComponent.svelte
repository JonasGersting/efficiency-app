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
        <div class="w-80 flex flex-row items-center justify-center gap-4 mb-5">
            <details class="dropdown btn-warning">
                <summary class="btn m-1">Person</summary>
                <ul
                    class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                    <li>
                        <button onclick={() => (noteTitle = "Jonas")}
                            >Jonas</button
                        >
                    </li>
                    <li>
                        <button onclick={() => (noteTitle = "Julia")}
                            >Julia</button
                        >
                    </li>
                </ul>
            </details>
            <span class="w-full">{noteTitle === "Jonas" || noteTitle === "Julia" ? noteTitle : "Bitte Person wählen"}</span>
        </div>
        <form
            method="dialog"
            class="w-80 flex flex-col items-center justify-center gap-4"
        >
            <textarea
                bind:value={noteContent}
                placeholder="Note"
                class="break-words resize-none h-[300px] textarea textarea-warning focus:outline-none"
            >
            </textarea>
            <div class="flex flex-row items-center justify-between w-full">
                <button onclick={addNote} class="btn btn-warning">Add</button>
                <button class="btn">Close</button>
            </div>
        </form>
    </div>
</dialog>
