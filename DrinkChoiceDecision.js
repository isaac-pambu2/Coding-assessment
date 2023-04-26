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
