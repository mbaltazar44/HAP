using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace HAP_API.Models;

public partial class HapDbContext : DbContext
{
    public HapDbContext()
    {
    }

    public HapDbContext(DbContextOptions<HapDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<Hospital> Hospitals { get; set; }

    public virtual DbSet<HospitalByDoctor> HospitalByDoctors { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.Property(e => e.DoctorId).HasColumnName("doctorId");
            entity.Property(e => e.DoctorName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("doctorName");
        });

        modelBuilder.Entity<Hospital>(entity =>
        {
            entity.Property(e => e.HospitalId).HasColumnName("hospitalId");
            entity.Property(e => e.HospitalName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("hospitalName");
        });

        modelBuilder.Entity<HospitalByDoctor>(entity =>
        {
            entity.ToTable("HospitalByDoctor");

            entity.Property(e => e.HospitalByDoctorId).HasColumnName("hospitalByDoctorId");
            entity.Property(e => e.DoctorId).HasColumnName("doctorId");
            entity.Property(e => e.HospitalId).HasColumnName("hospitalId");

            entity.HasOne(d => d.Doctor).WithMany(p => p.HospitalByDoctors)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HospitalByDoctor_Doctors");

            entity.HasOne(d => d.Hospital).WithMany(p => p.HospitalByDoctors)
                .HasForeignKey(d => d.HospitalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HospitalByDoctor_Hospitals");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.Property(e => e.PatientId).HasColumnName("patientId");
            entity.Property(e => e.HospitalId).HasColumnName("hospitalId");
            entity.Property(e => e.PatientAge).HasColumnName("patientAge");
            entity.Property(e => e.PatientEmail)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("patientEmail");
            entity.Property(e => e.PatientName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("patientName");
            entity.Property(e => e.PatientSymptom)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("patientSymptom");

            entity.HasOne(d => d.Hospital).WithMany(p => p.Patients)
                .HasForeignKey(d => d.HospitalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Patients_Hospitals");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
