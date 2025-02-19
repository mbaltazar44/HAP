import { ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { IDoctorByHospital } from "../../Interfaces/IDoctor";
import { Container, Row, Form, FormGroup, Label, Input, Button, Col, FormFeedback } from "reactstrap";
import axios from "axios";



export function NewDoctor(){

    const {id, name} = useParams()    
    const [options, setOptions] = useState([])
    useEffect(() => {
        const getHospitals = async () =>{
            const response  = await axios.get(`${appsettings.apiUrl}Hospitals/GetHospitals`)            
            const results : any = [];
            if(response.data.success){
                response.data.result.forEach((value:any) => {
                    results.push({
                      key: value.hospitalName,
                      value: value.hospitalId,
                    });
                  });                
            }            
            setOptions([{key: '--Seleccione--', value: ''},...results])
        }       
        getHospitals()
    }, [])    

    //Variables de validación formulario
    const [errorName, setErrorName] = useState(true)    
    const [errorHospital, setErrorHospital] = useState(true)    

    //Inicialización de Modelo Hospital
    const initialDoctorByHospital = {        
        doctorId: 0,
        doctorName:name,
        hospitalId: 0,
        hospitalName: ""
    }    
    const [doctor, setPatient] = useState<IDoctorByHospital>(initialDoctorByHospital)

    //Declaramos variable para navegar en el sitio
    const navigate = useNavigate()

    //Captura y valida los datos del hospital
    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setPatient({...doctor,[inputName]:inputValue})
        switch(inputName){
            case 'doctorName':            
                    if (!inputValue.trim()) {
                        setErrorName(true);
                    } else {
                        setErrorName(false);
                    }                
                break;                
            case 'hospitalId':            
                    if (!inputValue.trim()) {
                        setErrorHospital(true);
                    } else {
                        setErrorHospital(false);
                    }                
                break;                
        }
        
    }    

    //Regresar a Home
    const toBack = () => {
        navigate("/")
    }

    //Api guardar hospital
    const saveDoctor = async() =>{        
        const response  = await axios.post(`${appsettings.apiUrl}Doctors/NewDoctorByHospital`, doctor)                  
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
        if (!errorName) {            
            saveDoctor()
        }
      };

    return(
        <Container className="mt-5">
            <Row>
                <Col sm={{size:8, offset:2}}>
                    <h4>Nuevo Doctor</h4>
                    <hr/>
                    <Form onSubmit={handleSubmit} noValidate>
                        <FormGroup>
                            <Label>Hospital</Label>
                            <Row>
                            <Col sm={{size:10}}>            
                            
                            <Input name="hospitalId" type="select" onChange={inputChangeValue} value={doctor.hospitalId} invalid ={errorHospital}>
                                {                    
                                    options.map((option) => {                                                
                                        return(
                                            <option key={option.value} value={option.value} >
                                                {option.key}
                                            </option>
                                            
                                        )                        
                                    }
                                    )
                                }
                            </Input>                            
                            <FormFeedback>
                                {errorHospital ? 'El Hospital es requerido' : ''}
                            </FormFeedback>
                            </Col>
                            <Col style={{textAlign:"right", padding:0, margin:0}}>
                            <Link className="btn btn-outline-success mb-3" to={`/newHospital`} >Nuevo</Link>
                            </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="doctorName" maxLength={50} onChange={inputChangeValue} value={name != '' ? name: doctor.doctorName} invalid ={errorName} disabled={id != '0' ? true: false} ></Input>
                            <FormFeedback>
                                {errorName ? 'El Nombre es requerido' : ''}
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