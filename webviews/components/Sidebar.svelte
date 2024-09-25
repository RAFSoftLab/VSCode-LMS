<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let state = tsvscode.getState();
  let firstTimeLoaded = state ? state.firstTimeLoaded : false; // Flag to check if the extension is loaded for the first time
  let firstName: string = "";
  let lastName: string = "";
  let program: string = "";
  let number: number;
  let year: number;
  let classroom: string = "";
  let studentId: string = "";

  $: {
    tsvscode.setState({ firstTimeLoaded });
  }

  function parseStudentId(input: string): string {
    // Izvuci poslednji karakter (program)
    const program = input.slice(-1).toUpperCase();

    // Izvuci sve brojeve iz input stringa
    const numbers = input.match(/\d+/g)?.join("") ?? "";

    // Podeli brojeve na indeks i godinu
    const yearPart = numbers.slice(-2);
    const year = (parseInt(yearPart) + 2000).toString();
    const index = numbers.slice(0, -2);

    // Kombinuj ih u željeni format
    return `${program}${index}${year}`;
  }

  // Funkcija za čuvanje podataka u lokalnom skladištu
  function saveDataLocally() {
    const data = {
      firstName,
      lastName,
      program,
      number,
      year,
      classroom,
      studentId,
    };
    localStorage.setItem("studentData", JSON.stringify(data));
  }

  onMount(async () => {
    // Brisanje podataka iz localStorage prilikom svakog pokretanja ekstenzije
    console.log(tsvscode.getState());
    if (!firstTimeLoaded) {
      localStorage.removeItem("studentData");
      console.log("ULAZI U FIRST LOAD!!!!!!!!!!!!!");
      console.log(tsvscode.getState());
    }
    const savedData = localStorage.getItem("studentData");
    if (savedData) {
      console.log("SAAAVEEEEEEEEEEEE USAO U SAVEDATA");
      const parsedData = JSON.parse(savedData);
      console.log(savedData);
      firstName = parsedData.firstName;
      lastName = parsedData.lastName;
      program = parsedData.program;
      number = parsedData.number;
      year = parsedData.year;
      classroom = parsedData.classroom;
      studentId = parsedData.studentId;
    }
    window.addEventListener("message", async (event) => {
      const message = event.data; // Podaci u JSON formatu koje je ekstenzija poslala

      switch (message.type) {
        case "student-info": {
          console.log(message.value);

          const student = message.value;
          firstName = student.firstName;
          lastName = student.lastName;
          program = student.studyProgramShort;
          year = student.startYear;
          number = student.indexNumber;
          break;
        }
        case "user-info": {
          console.log(message.value);
          studentId = parseStudentId(message.value);
        }
        case "classroom-info": {
          classroom = message.value;
        }
      }
      //if (!firstTimeLoaded) {
      //console.log("SAAAVEEEEEEEEEEEE");
      //firstTimeLoaded = true; // Set the flag to prevent further clears in the same session
      saveDataLocally();
      // }
    });
  });

  function handleBeginClick() {
    tsvscode.postMessage({ type: "authorize-token", value: studentId });
    firstTimeLoaded = true;
    tsvscode.setState({ firstTimeLoaded });
    console.log("CONSOOOLEEEEEEEE");
    console.log(tsvscode.getState());
  }

  function handleCommitClick() {
    firstTimeLoaded = false;
    tsvscode.postMessage({ type: "commit", value: studentId });
  }
</script>

<h3>Your Information</h3>

<label for="firstName">First Name:</label>
<input type="text" id="firstName" bind:value={firstName} />

<label for="lastName">Last Name:</label>
<input type="text" id="lastName" bind:value={lastName} />

<label for="program">Program:</label>
<input type="text" id="program" bind:value={program} />

<label for="number">Number:</label>
<input type="number" id="number" bind:value={number} />

<label for="year">Year:</label>
<input type="number" id="year" bind:value={year} />

<label for="classroom">Classroom:</label>
<input type="text" id="classroom" bind:value={classroom} />

<label for="studentId">Student ID:</label>
<input type="text" id="studentId" bind:value={studentId} />

<!-- Begin Button -->
<button on:click={handleBeginClick} disabled={firstTimeLoaded}> Begin </button>

<!-- Commit Button -->
<button on:click={handleCommitClick} disabled={!firstTimeLoaded}>
  Commit
</button>

<style>
  button {
    background-color: blue;
    color: white;
    padding: 8px;
    margin: 4px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
</style>
