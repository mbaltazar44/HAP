import { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import axios from "axios";

export default function SelectHospitals(props){      
    const [options, setOptions] = useState([])
    useEffect(() => {
        const getHospitals = async () =>{
            const response  = await axios.get(`${appsettings.apiUrl}Hospitals/GetHospitalsByDoctor/${props.id}`)            
            const results : any = [];
            if(response.data.success){
                response.data.result.forEach((value:any) => {
                    results.push({
                      key: value.hospitalName,
                      value: value.hospitalId,
                    });
                  });                
            }            
            setOptions([{key: '--Seleccione--', value: '0'},...results])
        }       
        getHospitals()
    }, [props.id])   

    return(        
        <>
            <Label>Hospital</Label>
            <Input name="hostpitals" type="select" onChange={props.handleChange} invalid={props.invalid}>
                {                    
                    options.map((option) => {                                                
                        return(
                            <option key={option.value} value={option.value} selected={props.hospital == option.value ? true:false}>
                                {option.key}
                            </option>
                            
                        )                        
                    }
                    )
                }
            </Input>
        </>       
    )
}