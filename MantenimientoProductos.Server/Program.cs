using log4net;
using log4net.Config;
using MantenimientoProductos.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Configurar log4net
var logRepository = LogManager.GetRepository(System.Reflection.Assembly.GetEntryAssembly());
XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));
var logger = LogManager.GetLogger(typeof(Program));

logger.Info("Iniciando aplicación...");

// Configuración de servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<MantenimientoProductosContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// Configuración del pipeline de HTTP
if (app.Environment.IsDevelopment())
{
    logger.Info("Entorno de desarrollo detectado. Habilitando Swagger.");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

logger.Info("Aplicación iniciada correctamente.");

app.Run();
