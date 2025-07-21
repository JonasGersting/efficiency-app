<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { doc, setDoc, collection } from "firebase/firestore";

    let noteTitle: string = $state("");
    let noteContent: string = $state("");

    async function addNote() {
        if (!$user) {
            console.error("User not authenticated");
            return;
            
        }
        const newNoteRef = doc(collection(db, "notes"));
        await setDoc(
           newNoteRef,
            {
                title: noteTitle,
                content: noteContent,
                userId: $user.uid,
            },
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
        <h2 class="mb-32 text-3xl" >Add Note</h2>
        <form method="dialog" class="w-80 flex flex-col items-center justify-center gap-4">
            <input
                bind:value={noteTitle}
                type="text"
                placeholder="Title"
                class="input input-warning focus:outline-none"
            />
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
