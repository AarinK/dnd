// App.js
import React from 'react';
import ReactDOM from 'react-dom';
import DragAndDrop from './draganddrop';
const App = () => {
    return (
        <div>
            <DragAndDrop />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
