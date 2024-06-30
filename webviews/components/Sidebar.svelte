<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let firstName: string = "";
  let lastName: string = "";
  let program: string = "";
  let number: number;
  let year: number;
  let classroom: string = "";
  let studentId: string = "";

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
    const savedData = localStorage.getItem("studentData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      firstName = parsedData.firstName || "";
      lastName = parsedData.lastName || "";
      program = parsedData.program || "";
      number = parsedData.number || 0;
      year = parsedData.year || 0;
      classroom = parsedData.classroom || "";
      studentId = parsedData.studentId || "";
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
      }
      // Čuvanje podataka u lokalnom skladištu prilikom svake promene
      saveDataLocally();
    });
  });
  onDestroy(() => {
    // Brisanje podataka iz lokalnog skladišta kada se komponenta uništi
    //localStorage.clear();
    localStorage.getItem("studentData");
    // Resetovanje vrednosti let promenljivih
    firstName = "";
    lastName = "";
    program = "";
    number = 0;
    year = 0;
    classroom = "";
    studentId = "";
  });
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

<button
  on:click={() => {
    //tsvscode.postMessage({ type: "onInfo", value: studentId });
    tsvscode.postMessage({ type: "authorize-token", value: studentId });
  }}>Begin</button
>

<style>
  button {
    background-color: blue;
  }
</style>
