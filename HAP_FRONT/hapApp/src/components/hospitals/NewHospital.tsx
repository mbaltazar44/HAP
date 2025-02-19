import { ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IHospital } from "../../Interfaces/IHospital";
import { Container, Row, Form, FormGroup, Label, Input, Button, Col, FormFeedback } from "reactstrap";
import axios from "axios";



export function NewHospital(){

    //Variables de validación formulario
    const [errorName, setErrorName] = useState(true)    

    //Inicialización de Modelo Hospital
    const initialHospital = {        
        hospitalId: 0,
        hospitalName: ""
    }    
    const [hospital, setPatient] = useState<IHospital>(initialHospital)

    //Declaramos variable para navegar en el sitio
    const navigate = useNavigate()

    //Captura y valida los datos del hospital
    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setPatient({...hospital,[inputName]:inputValue})
        switch(inputName){
            case 'hospitalName':            
                    if (!inputValue.trim()) {
                        setErrorName(true);
                    } else {
                        setErrorName(false);
                    }                
                break;                
        }
        
    }    

    //Regresar a Home
    const toBack = () => {
        navigate("/NewDoctor")
    }

    //Api guardar hospital
    const saveHospital = async() =>{        
        const response  = await axios.post(`${appsettings.apiUrl}Hospitals/NewHospital`, hospital)                  
        if(response.data.success){                        
            Swal.fire({
                position: "center",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 1700
              });
              navigate("/NewDoctor")
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
            saveHospital()
        }
      };

    return(
        <Container className="mt-5">
            <Row>
                <Col sm={{size:8, offset:2}}>
                    <h4>Nuevo Hospital</h4>
                    <hr/>
                    <Form onSubmit={handleSubmit} noValidate>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="hospitalName" maxLength={50} onChange={inputChangeValue} value={hospital.hospitalName} invalid ={errorName} ></Input>
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