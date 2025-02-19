namespace HAP_API.DTO.DoctorsDTO
{
    public class DoctorByHospitalDTO
    {
        public int doctorId { get; set; }
        public string doctorName { get; set; }
        public int hospitalId { get; set; }        
        public string hospitalName { get; set; }

    }
}
