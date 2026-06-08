package za.ac.youthVend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.Address;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.AddressType;
import za.ac.youthVend.service.AddressService;
import za.ac.youthVend.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AddressController {

    private final AddressService addressService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Address>> getAllAddresses() {
        List<Address> addresses = addressService.findAll();
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable Integer id) {
        Optional<Address> addressOpt = addressService.findById(id);
        return addressOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAddressesByUserId(@PathVariable Integer userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        List<Address> addresses = addressService.findByUser(userOpt.get());
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Address>> getAddressesByType(@PathVariable String type) {
        AddressType addressType;
        try {
            addressType = AddressType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        List<Address> addresses = addressService.findByType(addressType);
        return ResponseEntity.ok(addresses);
    }


    @PostMapping
    public ResponseEntity<Address> createAddress(@RequestBody Address address) {
        Address created = addressService.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Integer id, @RequestBody Address address) {
        address.setAddressId(id);
        Address updated = addressService.update(address);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Integer id) {
        if (!addressService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        addressService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/set-default")
    public ResponseEntity<Address> setDefaultAddress(@PathVariable Integer id) {
        Optional<Address> addressOpt = addressService.findById(id);
        if (addressOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Address address = addressOpt.get();
        // In a full implementation, you would unset other default addresses
        Address updated = addressService.update(address);
        return ResponseEntity.ok(updated);
    }
}
