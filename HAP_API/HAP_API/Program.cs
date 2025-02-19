using HAP_API.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//agregamos cadena de conexión
builder.Services.AddDbContext<HapDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("HAP_Conexion"));
});

//Agregamos los CORS para que no tengamos problema al consumir la api
builder.Services.AddCors(options => {
    options.AddPolicy("HAP_Politica", app => {
        app.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//Inicializamos la politica
app.UseCors("HAP_Politica");
app.UseAuthorization();

app.MapControllers();

app.Run();
