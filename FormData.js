// in DrinkChoiceForm.js
import { DrinkChoice } from './db';

function DrinkChoiceForm() {
  // ...

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch('https://api.tom.com/models/drink_choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        setDecision(result.result);
        const drinkChoice = new DrinkChoice({ inputs: data, decision: result.result });
        drinkChoice.save();
      })
      .catch(error => console.error(error));
  }

  // ...
}
