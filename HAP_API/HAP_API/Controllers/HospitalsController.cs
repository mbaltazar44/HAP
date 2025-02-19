using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HAP_API.Models;
using HAP_API.DTO.HospitalsDTO;
using HAP_API.DTO.ResponseDTO;
using HAP_API.DTO.PatientsDTO;

namespace HAP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalsController : ControllerBase
    {
        private readonly HapDbContext dbContext;
        public HospitalsController(HapDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("GetHospitals")]
        public async Task<IActionResult> GetHospitals()
        {
            var response = new ResponseDTO<List<HospitalDTO>>();
            try
            {
                response.Result = await dbContext.Hospitals.AsNoTracking()                                        
                    .Select(s => new HospitalDTO { hospitalId = s.HospitalId, hospitalName = s.HospitalName })
                    .ToListAsync<HospitalDTO>();
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
        [Route("GetHospitalsByDoctor/{id}")]
        public async Task<IActionResult> GetHospitalsByDoctor(int id)
        {
            var response = new ResponseDTO<List<HospitalsByDoctorDTO>>();
            try
            {
                response.Result = await dbContext.HospitalByDoctors.AsNoTracking()
                    .Join(dbContext.Hospitals, hd => hd.HospitalId, h => h.HospitalId,(HD, H) => new { hd = HD, h = H})
                    .Where( x => x.hd.DoctorId == id)
                    .Select(s => new HospitalsByDoctorDTO { doctorId = s.hd.DoctorId, hospitalId = s.hd.HospitalId, hospitalName = s.h.HospitalName })
                    .ToListAsync< HospitalsByDoctorDTO>();
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
        [Route("NewHospital")]
        public async Task<IActionResult> NewHospital([FromBody] HospitalDTO hospital)
        {
            var response = new ResponseDTO<HospitalDTO>();
            try
            {
                if (hospital != null)
                {
                    response.Result = hospital;
                    Hospital newHospital = new Hospital
                    {
                        HospitalName = hospital.hospitalName
                    };
                    await dbContext.Hospitals.AddAsync(newHospital);
                    await dbContext.SaveChangesAsync();
                    response.Success = true;
                    response.Message = "El hospital: " + hospital.hospitalName.Trim() + ", se agregó correctamente!";
                    return response.Success ? Ok(response) : BadRequest(response);
                }
                else
                {
                    response.AddErrorSimple("No hay información del hospital a guardar");
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
