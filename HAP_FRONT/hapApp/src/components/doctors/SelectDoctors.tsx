import { useEffect, useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import axios from "axios";
import { Link } from "react-router-dom";



export function SelectDoctors(props){
    const [options, setOptions] = useState([])    
    

    useEffect(() => {
        const results : any = [];
        const getDoctors = async () =>{
            const response  = await axios.get(`${appsettings.apiUrl}Doctors/GetDoctors`)
            if(response.data.success){                
                response.data.result.forEach((value:any) => {
                    results.push({
                      key: value.doctorName,
                      value: value.doctorId,
                    });
                  });                
            }            
            setOptions([{key: '--Seleccione--', value: '0'},...results])
        }
        getDoctors()
        
    }, [])
    

    
    return(        
        
        <Row>
            <Label>Doctor</Label>
            <Col sm={{size:10}}>            
            <Input name="doctors" type="select" onChange={props.handleChange} >
                {
                    options.map((option) => 
                        (
                            <option key={option.value} value={option.value}>
                                {option.key}
                            </option>
                        )
                    )
                }
            </Input>      
            </Col>
            <Col style={{textAlign:"right", padding:0, margin:0}}>
            <Link className="btn btn-outline-success mb-3" to={`/newDoctor`} >Nuevo</Link>
            </Col>
            
        </Row>
            
            
        
    )
}