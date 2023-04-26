import React, { useState, useEffect } from 'react';

function DrinkChoiceForm() {
  const [variables, setVariables] = useState([]);
  const [modelName, setModelName] = useState('');

  useEffect(() => {
    fetch('https://api.tom.com/models/drink_choice')
      .then(response => response.json())
      .then(data => {
        setVariables(data.input_variables);
        setModelName(data.model_name);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // submit form data to query model and display decision
  }

  return (
    <div>
      <h1>{modelName}</h1>
      <form onSubmit={handleSubmit}>
        {variables.map(variable => (
          <div key={variable.name}>
            <label>{variable.label}</label>
            <input type="text" name={variable.name} />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DrinkChoiceForm;
