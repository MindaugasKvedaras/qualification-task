import { Dropdown } from "./components/Dropdown/Dropdown";
import { options } from "./stories/constants";


const App = () => {
  return (
    <div>
      <Dropdown 
        options={options} 
        displayValue="key"
        groupBy="cat"
        />
    </div>
  );
}

export default App;
