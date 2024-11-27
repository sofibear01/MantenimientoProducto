using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MantenimientoProductos.Server.Models;

public partial class MantenimientoProductosContext : DbContext
{
    public MantenimientoProductosContext()
    {
    }

    public MantenimientoProductosContext(DbContextOptions<MantenimientoProductosContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCategory> ProductCategories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__47027DF52113469F");

            entity.ToTable("Product");

            entity.Property(e => e.ProductId)
                .HasMaxLength(30)
                .HasColumnName("product_id");
            entity.Property(e => e.CategoryProductId).HasColumnName("category_product_id");
            entity.Property(e => e.HaveEcDiscount)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("have_EC_discount");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("is_active");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");
            entity.Property(e => e.ProductDescription)
                .HasMaxLength(200)
                .HasColumnName("product_description");
            entity.Property(e => e.Stock).HasColumnName("stock");

            entity.HasOne(d => d.CategoryProduct).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Product__categor__38996AB5");
        });

        modelBuilder.Entity<ProductCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryProductId).HasName("PK__ProductC__06FDB3347A69B3B6");

            entity.ToTable("ProductCategory");

            entity.Property(e => e.CategoryProductId).HasColumnName("category_product_id");
            entity.Property(e => e.CategoryDescription)
                .HasMaxLength(200)
                .HasColumnName("category_description");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("is_active");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
