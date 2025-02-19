namespace HAP_API.DTO.PatientsDTO
{
    public class PatientDTO
    {
        public int patientId { get; set; }
        public int  hospitalId { get; set; }
        public string patientName { get; set; }
        public int patientAge { get; set; }
        public string patientEmail { get; set; }
        public string patientSymptom { get; set; }

    }
}
