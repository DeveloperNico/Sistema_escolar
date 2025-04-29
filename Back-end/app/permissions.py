from rest_framework.permissions import BasePermission

class IsGestor(BasePermission):
    def has_permission(self, request, view):
        print("Usuário:", request.user)
        print("Cargo:", getattr(request.user, "cargo", None))
        if request.user.is_authenticated and request.user.cargo == 'G':
            return True
        return False
    
class IsProfessor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.cargo == 'P'