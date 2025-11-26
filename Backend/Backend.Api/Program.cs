using Backend.Api.Validators;
using Backend.Application.Interfaces;
using Backend.Application.Services;
using Backend.Infrastructure.Data;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var jwtKey = builder.Configuration["Jwt:Key"]!;
// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddScoped<IAppDbContext, AppDbContext>();
builder.Services.AddScoped<IUserService,UserService>();
builder.Services.AddScoped<IBillService, BillService>();
builder.Services.AddScoped<JwtService>();

builder.Services.AddValidatorsFromAssemblyContaining<RegisterUserValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<LoginValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UpdateProfileValidator>(); 
builder.Services.AddValidatorsFromAssemblyContaining<LinkAccountValidator>();   
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontend", policy =>
  {
    policy
          .WithOrigins("http://localhost:5173", "http://localhost:3000") // Порты фронтенда
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
  });
});

builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",            
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT in header. Example: Bearer {token}"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement {
  {
    new OpenApiSecurityScheme {
      Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    },
    Array.Empty<string>()
  }
});
});
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });


var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
