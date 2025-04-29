from django.contrib import admin
from .models import Usuario, Professor, Disciplina, ReservaAmbiente
from django.contrib.auth.admin import UserAdmin

class UsuarioAdmin(UserAdmin):
    fiedssets = UserAdmin.fieldsets + (
        ('Novos campos', {'fields': ('cargo',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('cargo',)}),
    )

admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Professor)
admin.site.register(Disciplina)
admin.site.register(ReservaAmbiente)