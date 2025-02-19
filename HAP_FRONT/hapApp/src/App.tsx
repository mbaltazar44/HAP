import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ListPatients } from "./components/patients/ListPatients"
import { NewPatient } from "./components/patients/newPatient"
import { EditPatient } from "./components/patients/EditPatient"
import { NewDoctor } from "./components/doctors/NewDoctor"
import { NewHospital } from "./components/hospitals/NewHospital"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPatients />}/>
        <Route path="/newPatient/:id" element={<NewPatient />}/>
        <Route path="/editPatient/:id" element={<EditPatient />}/>
        <Route path="/newDoctor/:id?/:name?" element={<NewDoctor />}/>
        <Route path="/newHospital" element={<NewHospital />}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App
