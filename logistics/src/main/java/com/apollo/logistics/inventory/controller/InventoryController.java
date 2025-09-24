package com.apollo.logistics.inventory.controller;
import org.springframework.web.bind.annotation.*;
import com.apollo.logistics.inventory.repository.InventoryRepository;
import com.apollo.logistics.inventory.entity.InventoryItem;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
  private final InventoryRepository repo;
  public InventoryController(InventoryRepository repo){ this.repo = repo; }

  @GetMapping public List<InventoryItem> list(){ return repo.findAll(); }
  @PostMapping public InventoryItem create(@RequestBody InventoryItem it){ return repo.save(it); }
  @PutMapping("{id}") public InventoryItem update(@PathVariable Long id, @RequestBody InventoryItem it){
    it.setId(id); return repo.save(it);
  }
  @DeleteMapping("{id}") public void delete(@PathVariable Long id){ repo.deleteById(id); }
}
