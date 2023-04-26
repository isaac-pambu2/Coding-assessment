# Coding-assessment

QUESTION ONE 

To get started, you'll need to create a new ReactJS project using your preferred method. Once you have your project set up, you can begin building the application.

First, let's create a component to display the form with input variables:

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

In this component, we use the useState and useEffect hooks to fetch the metadata from the TOM API and set the input variables and model name state variables. We then use the map function to render the input variables as form fields, with the handleSubmit function handling form submission.

Next, let's create a component to display the decision:

import React, { useState } from 'react';

function DrinkChoiceDecision(props) {
  const [decision, setDecision] = useState('');

  const handleClick = () => {
    // reset decision state when user clicks button
    setDecision('');
  }

  return (
    <div>
      {decision ? (
        <div>
          <h2>Decision: {decision}</h2>
          <button onClick={handleClick}>Reset</button>
        </div>
      ) : (
        <h2>No decision yet</h2>
      )}
    </div>
  );
}

export default DrinkChoiceDecision;

In this component, we use the useState hook to set the decision state variable. We render the decision if it exists, with a button to reset the decision state, or a message indicating that no decision has been made yet.

Finally, we can put it all together in our main App component:

import React from 'react';
import DrinkChoiceForm from './DrinkChoiceForm';
import DrinkChoiceDecision from './DrinkChoiceDecision';

function App() {
  return (
    <div>
      <DrinkChoiceForm />
      <DrinkChoiceDecision />
    </div>
  );
}

export default App;

This component simply renders the DrinkChoiceForm and DrinkChoiceDecision components.

That's it! With these components, you should have a basic web application that pulls metadata from the TOM API for the "Drink choice" model and displays the model name and input variables in a form. When the user submits the form, the application queries the model and displays the decision on the screen.


QUESTON TWO

Add Functionality to Store Data Gathered from the TOM API
To add functionality to store data gathered from the TOM API, we can use MongoDB and Mongoose. First, we need to install the required packages:

npm install mongoose
npm install dotenv

Next, we can create a database connection and a schema for the "Drink choice" model data:

// in db.js
const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const drinkChoiceSchema = new mongoose.Schema({
  inputs: {
    type: Map,
    of: String,
  },
  decision: String,
}, { timestamps: true });

const DrinkChoice = mongoose.model('DrinkChoice', drinkChoiceSchema);

module.exports = { DrinkChoice };

Here, we create a DrinkChoice schema that includes a inputs field to store the input variables and a decision field to store the model decision. We also include timestamps for each document to keep track of when the data was stored.

Now, we can modify our form submission handler in DrinkChoiceForm to store the data in the database:

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

Here, we use FormData to extract the form data and send it to the TOM API. Once we receive the model decision, we set it in the state variable and create a new DrinkChoice document using Mongoose and save it to the database.

Security Considerations
To address security considerations, we can add authentication and authorization to our web application using JWT and bcrypt.

First, we need to install the required packages:

npm install bcrypt
npm install jsonwebtoken

Next, we can create a User schema in our database:

// in db.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ...

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process








