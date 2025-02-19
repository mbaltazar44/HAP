using System;
using System.Collections.Generic;

namespace HAP_API.Models;

public partial class HospitalByDoctor
{
    public int HospitalByDoctorId { get; set; }

    public int DoctorId { get; set; }

    public int HospitalId { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;

    public virtual Hospital Hospital { get; set; } = null!;
}
