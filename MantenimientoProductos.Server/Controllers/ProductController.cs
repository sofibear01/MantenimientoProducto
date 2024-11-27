using log4net;
using MantenimientoProductos.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private static readonly ILog _logger = LogManager.GetLogger(typeof(ProductsController));
    private readonly MantenimientoProductosContext _context;

    public ProductsController(MantenimientoProductosContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        _logger.Info("GetAllProducts called.");
        try
        {
            var products = await _context.Products.AsNoTracking().Include(p => p.CategoryProduct).ToListAsync();
            _logger.Info($"GetAllProducts returned {products.Count} products.");
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.Error("Error in GetAllProducts.", ex);
            return StatusCode(500, "Ocurrió un error al obtener los productos.");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id)
    {
        _logger.Info($"GetProductById called with id: {id}");
        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                _logger.Warn($"Product with id {id} not found.");
                return NotFound();
            }
            _logger.Info($"Product with id {id} found.");
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.Error($"Error in GetProductById for id: {id}", ex);
            return StatusCode(500, "Ocurrió un error al obtener el producto.");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto productDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Crear la entidad Product a partir del DTO
            var product = new Product
            {
                ProductId = productDto.ProductId,
                CategoryProductId = productDto.CategoryProductId,
                ProductDescription = productDto.ProductDescription,
                Stock = productDto.Stock,
                Price = productDto.Price,
                HaveEcDiscount = productDto.HaveEcDiscount,
                IsActive = productDto.IsActive
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = product.ProductId }, product);
        }
        catch (Exception ex)
        {
            _logger.Error("Error in CreateProduct.", ex);
            return StatusCode(500, "Ocurrió un error al crear el producto.");
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] Product updatedProduct)
    {
        _logger.Info($"UpdateProduct called with id: {id}");
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.Warn("Invalid model state in UpdateProduct.");
                return BadRequest(ModelState);
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                _logger.Warn($"Product with id {id} not found in UpdateProduct.");
                return NotFound();
            }

            product.ProductDescription = updatedProduct.ProductDescription;
            product.Stock = updatedProduct.Stock;
            product.Price = updatedProduct.Price;
            product.HaveEcDiscount = updatedProduct.HaveEcDiscount;
            product.IsActive = updatedProduct.IsActive;

            await _context.SaveChangesAsync();
            _logger.Info($"Product with id {id} updated successfully.");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.Error($"Error in UpdateProduct for id: {id}", ex);
            return StatusCode(500, "Ocurrió un error al actualizar el producto.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        _logger.Info($"DeleteProduct called with id: {id}");
        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                _logger.Warn($"Product with id {id} not found in DeleteProduct.");
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            _logger.Info($"Product with id {id} deleted successfully.");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.Error($"Error in DeleteProduct for id: {id}", ex);
            return StatusCode(500, "Ocurrió un error al eliminar el producto.");
        }
    }
}
