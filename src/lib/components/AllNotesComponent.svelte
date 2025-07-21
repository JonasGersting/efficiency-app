<script lang="ts">
    import { db, user } from "$lib/firebase";
    import { collection, query, where, onSnapshot } from "firebase/firestore";

    interface Note {
        id: string;
        title: string;
        content: string;
    }

    let notes: Note[] = $state([]);

    $effect(() => {
        if ($user) {
            // Erstelle eine Abfrage, die nur Notizen des aktuellen Benutzers abruft
            const q = query(
                collection(db, "notes"),
                where("userId", "==", $user.uid),
            );

            // Richte einen Echtzeit-Listener ein
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                notes = querySnapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() } as Note;
                });
            });

            // Die `unsubscribe`-Funktion wird automatisch aufgerufen, wenn die Komponente zerstört wird
            // oder wenn sich $user ändert, um den Listener zu bereinigen.
            return () => unsubscribe();
        } else {
            // Wenn kein Benutzer angemeldet ist, leere die Notizenliste
            notes = [];
        }
    });
</script>

{#if notes.length > 0}
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {#each notes as note (note.id)}
            <div class="bg-orange-300 p-4 rounded-lg shadow-md flex flex-col">
                <h3 class="font-bold text-lg mb-2">{note.title}</h3>
                <p class="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
        {/each}
    </div>
{:else}
    <div class="w-full flex justify-center items-center ">
        <p>No notes found. Add a new one to get started!</p>
    </div>
{/if}
