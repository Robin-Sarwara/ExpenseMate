import { ClipLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex z-10 justify-center items-center fixed inset-0">
      <ClipLoader color="#3498db" size={75} cssOverride={{ borderWidth: "8px" }} />
    </div>
  );
}

export default Spinner;
