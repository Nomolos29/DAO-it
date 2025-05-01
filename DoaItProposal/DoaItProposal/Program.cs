using DoaItProposal.Api.Extensions;
using FluentValidation.AspNetCore;
using NLog;
using SignalR;

var builder = WebApplication.CreateBuilder(args);
LogManager.LoadConfiguration(string.Concat(Directory.GetCurrentDirectory(), "/nlog.config"));

builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();
builder.Services.ConfigureSqlContext(builder.Configuration);
builder.Services.ConfigureController();
builder.Services.ConfigureCors();
builder.Services.ConfigureSwagger();
builder.Services.ConfigureLoggerService();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddExceptionHandler<CustomExceptionHandler>();
builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.AddSignalR();
builder.Services.AddAuthentication();
builder.Services.ConfigureIdentity();
var app = builder.Build();



app.UseExceptionHandler(options =>
{

});
app.UseSwagger();
app.UseSwaggerUI(s =>
{
    s.SwaggerEndpoint("/swagger/v1/swagger.json", "DoaIt Proposal Api");
    
});

app.MapHub<ProposalHub>("/proposalHub");
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
