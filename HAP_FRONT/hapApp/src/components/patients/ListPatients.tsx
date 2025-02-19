import { useEffect, useState } from "react"
import { appsettings } from "../../settings/appsettings"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "axios";
import { IPatients } from "../../Interfaces/IPatient";

import SelectHospitals from "../hospitals/SelectHospitals"
import { SelectDoctors } from "../doctors/SelectDoctors"
import { Form, Col, Container, FormGroup, Row, Table, Button } from "reactstrap"
export function ListPatients(){   
    const [doctorId, setDoctorId] = useState(0)                   
    const [hospitalId, setHospitalId] = useState(0)                   
    const [patients, setPatients] = useState<IPatients[]>([])

    const doctorHandleChange = (e) => {
        setDoctorId(e.target.value)                   
      };
    const hospitalHandleChange = (e) => {
        setHospitalId(e.target.value)                           
      };   
    const getPatients = async () => {
        const response  = await axios.get(`${appsettings.apiUrl}Patients/GetPatientsByHospital/${hospitalId}`)            
        if(response.data.success){            
            setPatients(response.data.result);
        }
    }

    useEffect(()=>{
        getPatients()
        
    },[hospitalId])


    const deletePatient = (id:number) => {
        Swal.fire({
            title: "Estás seguro?",
            text: "Eliminar paciente!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!"
          }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.delete(`${appsettings.apiUrl}Patients/DeletePatient/${id}`,{method:'DELETE'})
                if(response.data.success) 
                {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 1700
                      });
                    await getPatients()                   
                    
                }
            }
          });
    }

    const message = () =>{
        Swal.fire({
            position: "center",
            icon: "info",
            title: "Seleccione Doctor y Hospital",
            showConfirmButton: false,
            timer: 1700
          });

    }

    return(        
        
        <Container className="mt-5">
            <Row>
                <Col sm={{size:8, offset:2}}>
                    <h4>Registro de Pacientes</h4>
                    <hr/>
                    <Form>                        
                        <FormGroup>   
                        <Row>                                                     
                            <SelectDoctors handleChange={doctorHandleChange}/> 
                            
                        </Row>
                            
                        </FormGroup>
                        <FormGroup>                            
                            <SelectHospitals handleChange={hospitalHandleChange} id = {doctorId} hospital = {0}/>                            
                        </FormGroup>
                    </Form>                    
                </Col>
                <Col sm={{size:8, offset:2}}>
                    <hr/>
                    <Row>
                        <Col><h6>Lista de Pacientes</h6></Col>
                        <Col style={{textAlign:'right'}}>
                        {
                            hospitalId > 0 ? <Link className="btn btn-outline-success mb-3" to={`/newPatient/${hospitalId}`} >Nuevo</Link> : <Link className="btn btn-outline-success mb-3" to="#" onClick={message} >Nuevo</Link>
                        }                        
                        </Col>
                    </Row>                    
                    
                    <Table striped dark responsive>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Nombre</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                patients.map((item)=>(
                                    <tr key={item.patientId}>
                                        <td>{item.patientId}</td>
                                        <td>{item.patientName}</td>
                                        <td style={{textAlign:"right"}}>
                                        <Link className="btn btn-outline-primary me-2" to={`/editPatient/${item.patientId}`}>Editar</Link>
                                        <Button outline color="danger" onClick={() => {deletePatient(item.patientId!)}}>Eliminar</Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>                
            </Row>
        </Container> 
    )
}