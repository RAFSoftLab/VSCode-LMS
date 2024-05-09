<script lang="ts">
    let firstName: string = "";
    let lastName: string = "";
    let program: string = "";
    let number: number;
    let year: number;
    let classroom: string = "";
  
    function handleSubmit() {
      console.log("Submitted data:");
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("Program:", program);
      console.log("Number:", number);
      console.log("Year:", year);
      console.log("Classroom:", classroom);
  
      // Add further logic here, e.g., sending the data to a server
    }
  </script>
  
  <style>
    button{
        background-color: blue;
    }
    </style>
  
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
  
  <button on:click={handleSubmit}>Begin</button>
  