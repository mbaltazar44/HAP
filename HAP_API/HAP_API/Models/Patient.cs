using System;
using System.Collections.Generic;

namespace HAP_API.Models;

public partial class Patient
{
    public int PatientId { get; set; }

    public int HospitalId { get; set; }

    public string PatientName { get; set; } = null!;

    public int PatientAge { get; set; }

    public string PatientEmail { get; set; } = null!;

    public string PatientSymptom { get; set; } = null!;

    public virtual Hospital Hospital { get; set; } = null!;
}
