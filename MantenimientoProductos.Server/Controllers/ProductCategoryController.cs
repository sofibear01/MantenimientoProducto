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

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] ProductCategory category)
    {
        _logger.Info("CreateCategory called.");
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.Warn("Invalid model state in CreateCategory.");
                return BadRequest(ModelState);
            }

            _context.ProductCategories.Add(category);
            await _context.SaveChangesAsync();
            _logger.Info($"Category created with id: {category.CategoryProductId}");
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.CategoryProductId }, category);
        }
        catch (Exception ex)
        {
            _logger.Error("Error in CreateCategory.", ex);
            return StatusCode(500, "Ocurrió un error al crear la categoría.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] ProductCategory updatedCategory)
    {
        _logger.Info($"UpdateCategory called with id: {id}");
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.Warn("Invalid model state in UpdateCategory.");
                return BadRequest(ModelState);
            }

            var category = await _context.ProductCategories.FindAsync(id);
            if (category == null)
            {
                _logger.Warn($"Category with id {id} not found in UpdateCategory.");
                return NotFound();
            }

            category.CategoryDescription = updatedCategory.CategoryDescription;
            category.IsActive = updatedCategory.IsActive;

            await _context.SaveChangesAsync();
            _logger.Info($"Category with id {id} updated successfully.");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.Error($"Error in UpdateCategory for id: {id}", ex);
            return StatusCode(500, "Ocurrió un error al actualizar la categoría.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        _logger.Info($"DeleteCategory called with id: {id}");
        try
        {
            var category = await _context.ProductCategories.FindAsync(id);
            if (category == null)
            {
                _logger.Warn($"Category with id {id} not found in DeleteCategory.");
                return NotFound();
            }

            _context.ProductCategories.Remove(category);
            await _context.SaveChangesAsync();
            _logger.Info($"Category with id {id} deleted successfully.");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.Error($"Error in DeleteCategory for id: {id}", ex);
            return StatusCode(500, "Ocurrió un error al eliminar la categoría.");
        }
    }
}
