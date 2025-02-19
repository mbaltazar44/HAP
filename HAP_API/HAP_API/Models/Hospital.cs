using System;
using System.Collections.Generic;

namespace HAP_API.Models;

public partial class Hospital
{
    public int HospitalId { get; set; }

    public string HospitalName { get; set; } = null!;

    public virtual ICollection<HospitalByDoctor> HospitalByDoctors { get; set; } = new List<HospitalByDoctor>();

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();
}
