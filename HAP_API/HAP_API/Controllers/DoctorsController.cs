using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HAP_API.Models;
using HAP_API.DTO.ResponseDTO;
using HAP_API.DTO.DoctorsDTO;

namespace HAP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly HapDbContext dbContext;
        public DoctorsController(HapDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("GetDoctors")]
        public async Task<IActionResult> GetDoctors()
        {
            var response = new ResponseDTO<List<Doctor>>();
            try
            {
                response.Result = await dbContext.Doctors.ToListAsync<Doctor>();
                response.Success = true;
                return response.Success ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
            }
        }

        [HttpPost]
        [Route("NewDoctorByHospital")]
        public async Task<IActionResult> NewDoctorByHospital([FromBody] DoctorByHospitalDTO doctor)
        {
            var response = new ResponseDTO<DoctorByHospitalDTO>();
            try
            {
                if (doctor != null)
                {
                    response.Result = doctor;
                    var searchDoctor = await dbContext.Doctors.FindAsync(doctor.doctorId);
                    if(searchDoctor == null)
                    {
                        Doctor newDoctor = new Doctor
                        {
                            DoctorName = doctor.doctorName
                        };
                        await dbContext.Doctors.AddAsync(newDoctor);
                        await dbContext.SaveChangesAsync();
                    }                    

                    HospitalByDoctor hospitalByDoctor = new HospitalByDoctor
                    {
                        HospitalId = doctor.hospitalId,
                        DoctorId = newDoctor.DoctorId
                    };
                    await dbContext.HospitalByDoctors.AddAsync(hospitalByDoctor);
                    await dbContext.SaveChangesAsync();

                    response.Success = true;
                    response.Message = "El doctor: " + newDoctor.DoctorName + ", se agregó correctamente!";
                    return response.Success ? Ok(response) : BadRequest(response);
                }
                else
                {
                    response.AddErrorSimple("No hay información del doctor a guardar");
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
