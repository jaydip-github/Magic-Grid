import { ChangeEventHandler, useState } from "react";

import { useNavigate } from "react-router-dom";
import { IFormState } from "../types";
import { NAVIGATION_CONSTANT } from "../constants/navigation.constants";
import "../css/form.css";

function Form() {
  // Hook
  const navigate = useNavigate();

  // state
  const [formState, setFormState] = useState<IFormState>({
    aspect_ratio: 0,
    column: 0,
    row: 0,
  });

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: +e?.target?.value,
    }));
  };

  const onSubmit = () => {
    // Validation
    const isAllFieldValid = Object.keys(formState).every(
      (key) => formState[key as keyof typeof formState] > 0
    );
    // we passed form data through navigation state
    if (isAllFieldValid) {
      localStorage.setItem('gridDimension',JSON.stringify(formState))
      navigate(NAVIGATION_CONSTANT.MAGIC_GRID, {
        state: formState,
      });
    }
  };

  return (
    <div className="outer_div flex_box">
      <div className="flex_box input_form">
        <div className="item">
          <span>Row</span>
          <input type="text" name="row" onChange={onInputChange} />
        </div>
        <div className="item">
          <span>Column</span>
          <input type="text" name="column" onChange={onInputChange} />
        </div>
        <div className="item">
          <span>Aspect Ratio</span>
          <input type="text" name="aspect_ratio" onChange={onInputChange} />
        </div>
        <button className="submit_button" onClick={onSubmit}>
          Generate
        </button>
      </div>
    </div>
  );
}

export default Form;
