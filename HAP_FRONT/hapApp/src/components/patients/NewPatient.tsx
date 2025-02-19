import { ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { IPatient } from "../../Interfaces/IPatient";
import { Container, Row, Form, FormGroup, Label, Input, Button, Col, FormFeedback } from "reactstrap";
import axios from "axios";



export function NewPatient(){

    //Variables de validación formulario
    const [errorName, setErrorName] = useState(true)
    const [errorAge, setErrorAge] = useState(true)
    const [errorEmail, setErrorEmail] = useState(true)    
    const [errorSymptom, setErrorSymptom] = useState(true)    
    
    //Parámetro de URL (hospitalId)
    const {id} = useParams<{id:string}>()

    //Inicialización de Modelo Paciente
    const initialPatient = {
        patientId: 0,
        hospitalId: id,
        patientName: "",
        patientAge: 0,
        patientEmail: "",
        patientSymptom: ""
    }    
    const [patient, setPatient] = useState<IPatient>(initialPatient)

    //Declaramos variable para navegar en el sitio
    const navigate = useNavigate()

    //Captura y valida los datos del paciente
    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setPatient({...patient,[inputName]:inputValue})
        switch(inputName){
            case 'patientName':            
                    if (!inputValue.trim()) {
                        setErrorName(true);
                    } else {
                        setErrorName(false);
                    }                
                break;
                case 'patientAge':
                    if (!inputValue.trim() || inputValue == '0') {
                        setErrorAge(true);
                    } else {
                        setErrorAge(false);
                    }
                break;
                case 'patientEmail':
                    if (!inputValue.trim()) {
                        setErrorEmail(true);
                    } else {
                        setErrorEmail(false);
                    }
                break;
                case 'patientSymptom':
                    if (!inputValue.trim()) {
                        setErrorSymptom(true);
                    } else {
                        setErrorSymptom(false);
                    }
                break;
        }
        
    }    

    //Regresar a Home
    const toBack = () => {
        navigate("/")
    }

    //Api guardar paciente
    const savePatient = async() =>{
        console.log(patient)
        const response  = await axios.post(`${appsettings.apiUrl}Patients/NewPatient`, patient)        
          
        if(response.data.success){                        
            Swal.fire({
                position: "center",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 1700
              });
            navigate("/")
        }        
        else{
            Swal.fire({
                position: "center",
                icon: "warning",
                title: response.data.message,
                showConfirmButton: false,
                timer: 1700
              });
        }
    }

    //Validamos el Form
    const handleSubmit = (e) => {        
        e.preventDefault();        
        if (!errorName && !errorAge && !errorEmail && !errorSymptom) {            
            savePatient()
        }
      };

    return(
        <Container className="mt-5">
            <Row>
                <Col sm={{size:8, offset:2}}>
                    <h4>Nuevo Paciente</h4>
                    <hr/>
                    <Form onSubmit={handleSubmit} noValidate>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="patientName" maxLength={50} onChange={inputChangeValue} value={patient.patientName} invalid ={errorName} ></Input>
                            <FormFeedback>
                                {errorName ? 'El Nombre es requerido' : ''}
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label>Edad</Label>
                            <Input type="number" name="patientAge" onChange={inputChangeValue} value={patient.patientAge} invalid ={errorAge}></Input>
                            <FormFeedback>
                                {errorAge ? 'La Edad es requerida' : ''}
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input type="email" name="patientEmail" maxLength={50} onChange={inputChangeValue} value={patient.patientEmail} invalid ={errorEmail}></Input>
                            <FormFeedback>
                                {errorEmail ? 'El Email es requerido o el Formato es incorrecto' : ''}
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label>Síntomas</Label>
                            <Input type="textarea" name="patientSymptom" maxLength={200} onChange={inputChangeValue} value={patient.patientSymptom} invalid ={errorSymptom}></Input>
                            <FormFeedback>
                                {errorSymptom ? 'Los Sintomas son requeridos' : ''}
                            </FormFeedback>
                        </FormGroup>

                        <Button color="primary" className="me-4" type="submit">Guardar</Button>
                        <Button color="secondary" onClick={toBack}>Regresar</Button>
                    </Form>                    
                </Col>
            </Row>
        </Container>
    )
}