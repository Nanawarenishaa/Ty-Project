package net.Typroject.ProjectSRAAS.Controller;
import net.Typroject.dto.LoginRequest;
import net.Typroject.dto.SignupRequest;
import net.Typroject.model.User;
import net.Typroject.security.JwtTokenUtil;
import net.Typroject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // Signup
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        User newUser = userService.registerUser(signupRequest);
        return ResponseEntity.ok(newUser);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        // Authentication step
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // Generate JWT token
        String token = jwtTokenUtil.generateToken(authentication);
        return ResponseEntity.ok("Bearer " + token);
    }
}
