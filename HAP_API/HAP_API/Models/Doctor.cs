using System;
using System.Collections.Generic;

namespace HAP_API.Models;

public partial class Doctor
{
    public int DoctorId { get; set; }

    public string DoctorName { get; set; } = null!;

    public virtual ICollection<HospitalByDoctor> HospitalByDoctors { get; set; } = new List<HospitalByDoctor>();
}
