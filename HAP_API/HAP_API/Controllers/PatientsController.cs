using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HAP_API.Models;
using HAP_API.DTO.PatientsDTO;
using HAP_API.DTO.ResponseDTO;

namespace HAP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly HapDbContext dbContext;
        public PatientsController(HapDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("GetPatientsByHospital/{id}")]
        public async Task<IActionResult> GetPatientsByHospital(int id)
        {
            var response = new ResponseDTO<List<PatientsByHospitalDTO>>();
            try
            {
                response.Result = await dbContext.Patients.AsNoTracking()                    
                    .Where(x => x.HospitalId == id)
                    .Select(s => new PatientsByHospitalDTO { patientId = s.PatientId, patientName = s.PatientName})
                    .ToListAsync<PatientsByHospitalDTO>();
                response.Success = true;
                return response.Success ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                response.AddError(ex);
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
        }

        [HttpGet]
        [Route("GetPatient/{id}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var response = new ResponseDTO<PatientDTO>();
            try
            {
                response.Result = await dbContext.Patients.AsNoTracking()
                    .Where(x => x.PatientId == id)
                    .Select(s => new PatientDTO { patientId = s.PatientId, hospitalId = s.HospitalId, patientName = s.PatientName, patientAge = s.PatientAge, patientEmail = s.PatientEmail, patientSymptom = s.PatientSymptom })
                    .FirstOrDefaultAsync<PatientDTO>();
                response.Success = true;
                return response.Success ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                response.AddError(ex);
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
        }

        [HttpPost]
        [Route("NewPatient")]
        public async Task<IActionResult> NewPatient([FromBody] PatientDTO patient)
        {
            var response = new ResponseDTO<PatientDTO>();
            try
            {
                if (patient != null)
                {
                    response.Result = patient;
                    Patient newPatient = new Patient
                    {
                        HospitalId = patient.hospitalId,
                        PatientName = patient.patientName,
                        PatientAge = patient.patientAge,
                        PatientEmail = patient.patientEmail,
                        PatientSymptom = patient.patientSymptom
                    };
                    await dbContext.Patients.AddAsync(newPatient);
                    await dbContext.SaveChangesAsync();
                    response.Success = true;
                    response.Message = "El paciente: " + patient.patientName.Trim() + ", se agregó correctamente!";
                    return response.Success ? Ok(response) : BadRequest(response);
                }
                else
                {
                    response.AddErrorSimple("No hay información del paciente a guardar");
                    return StatusCode(StatusCodes.Status400BadRequest, response);
                }
            }
            catch (Exception ex)
            {
                response.AddError(ex);
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
        }

        [HttpPut]
        [Route("EditPatient")]
        public async Task<IActionResult> EditPatient([FromBody] PatientDTO patient)
        {
            var response = new ResponseDTO<Patient>();
            try
            {
                var searchPatient = await dbContext.Patients.FindAsync(patient.patientId);
                if (searchPatient != null)
                {                    
                    searchPatient.PatientId = patient.patientId;
                    searchPatient.HospitalId = patient.hospitalId;
                    searchPatient.PatientName = patient.patientName;                    
                    searchPatient.PatientEmail = patient.patientEmail;
                    searchPatient.PatientAge = patient.patientAge;
                    searchPatient.PatientSymptom = patient.patientSymptom;

                    dbContext.Patients.Entry(searchPatient).State = EntityState.Modified;
                    await dbContext.SaveChangesAsync();
                    response.Success = true;
                    response.Message = "El paciente: " + patient.patientName.Trim() + ", se modificó correctamente!";
                    return response.Success ? Ok(response) : BadRequest(response);
                }
                else
                {
                    response.AddErrorSimple($"No existe información del paciente con id: {patient.patientId}");
                    return StatusCode(StatusCodes.Status400BadRequest, response);
                }
            }
            catch (Exception ex)
            {
                response.AddError(ex);
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
        }

        [HttpDelete]
        [Route("DeletePatient/{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var response = new ResponseDTO<Patient>();
            try
            {
                var searchPatient = await dbContext.Patients.FindAsync(id);
                if (searchPatient != null)
                {
                    response.Result = searchPatient;
                    dbContext.Patients.Remove(searchPatient);
                    await dbContext.SaveChangesAsync();
                    response.Success = true;
                    response.Message = "El paciente: " + searchPatient.PatientName.Trim() + ", se eliminó correctamente!";
                    return response.Success ? Ok(response) : BadRequest(response);
                }
                else
                {
                    response.AddErrorSimple($"No existe información del paciente con id: {id}");
                    return StatusCode(StatusCodes.Status400BadRequest, response);
                }
            }
            catch (Exception ex)
            {
                response.AddError(ex);
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
        }



    }
}
