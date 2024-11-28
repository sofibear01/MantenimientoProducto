using log4net;
using MantenimientoProductos.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ProductCategoryController : ControllerBase
{
    private static readonly ILog _logger = LogManager.GetLogger(typeof(ProductCategoryController));
    private readonly MantenimientoProductosContext _context;

    public ProductCategoryController(MantenimientoProductosContext context)
    {
        _logger.Info("CategoriesController initialized.");
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        _logger.Info("GetAllCategories called.");
        try
        {
            var categories = await _context.ProductCategories.AsNoTracking().ToListAsync();
            _logger.Info($"Found {categories.Count} categories.");
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.Error("Error in GetAllCategories.", ex);
            return StatusCode(500, "Ocurrió un error al obtener las categorías.");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        _logger.Info($"GetCategoryById called with id: {id}");
        try
        {
            var category = await _context.ProductCategories.FindAsync(id);
            if (category == null)
            {
                _logger.Warn($"Category with id {id} not found.");
                return NotFound();
            }
            _logger.Info($"Category with id {id} found.");
            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.Error($"Error in GetCategoryById for id: {id}", ex);
            return StatusCode(500, "Ocurrió un error al obtener la categoría.");
        }
    }

}
