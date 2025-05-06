from django.contrib import admin
from .models import Usuario, Disciplina, ReservaAmbiente
from django.contrib.auth.admin import UserAdmin

class UsuarioAdmin(UserAdmin):
    fiedssets = UserAdmin.fieldsets + (
        ('Novos campos', {'fields': ('cargo', 'ni', 'telefone', 'dt_nascimento', 'dt_contratacao')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('cargo', 'ni', 'telefone', 'dt_nascimento', 'dt_contratacao')}),
    )

admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Disciplina)
admin.site.register(ReservaAmbiente)