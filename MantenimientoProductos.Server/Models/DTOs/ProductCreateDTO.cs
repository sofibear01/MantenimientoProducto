public class ProductCreateDto
{
    public string ProductId { get; set; }
    public int CategoryProductId { get; set; }
    public string ProductDescription { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string HaveEcDiscount { get; set; }
    public string IsActive { get; set; }
}
