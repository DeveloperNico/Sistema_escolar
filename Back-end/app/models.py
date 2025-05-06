from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class Usuario(AbstractUser):
    CARGOS = [
        ('G', 'Gestor'),
        ('P', 'Professor')
    ]
    cargo = models.CharField(max_length=1, choices=CARGOS, default='P')
    
    def __str__(self):
        return self.username
class Professor(models.Model):
    validador_ni = RegexValidator (
        regex=r'^\d{5}/\d{2}$',
        message='O número de identificação deve seguir o formato 12345/67'
    )
    ni = models.CharField(max_length=10, unique=True, validators=[validador_ni])
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    validador_telefone = RegexValidator (
        regex=r'^\d{2} \d{5}-\d{4}$',
        message='O telefone deve seguir o formato 12 12345-6789'
    )
    telefone = models.CharField(max_length=15, blank=True, null=True, validators=[validador_telefone])
    dt_nascimento = models.DateField(blank=True, null=True)
    dt_contratacao = models.DateField(blank=True, null=True)
    disciplina = models.ForeignKey('Disciplina', on_delete=models.CASCADE, blank=True, null=True, related_name='professores')

    class Meta:
        verbose_name_plural = 'Professores'
    
    def __str__(self):
        return self.nome
    
class Disciplina(models.Model):
    nome = models.CharField(max_length=100)
    curso = models.CharField(max_length=100)
    carga_horaria = models.IntegerField()
    descricao = models.TextField(blank=True, null=True)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='disciplinas')

    class Meta:
        verbose_name_plural = 'Disciplinas'

    def __str__(self):
        return self.nome
    
class ReservaAmbiente(models.Model):
    dt_inicio = models.DateTimeField()
    dt_termino = models.DateTimeField()
    periodo = models.CharField(max_length=50, choices=[
        ('Manhã', 'Manhã'),
        ('Tarde', 'Tarde'),
        ('Noite', 'Noite')
    ])
    sala_reservada = models.CharField(max_length=50)
    professor_responsavel = models.ForeignKey(Professor, on_delete=models.CASCADE)
    disciplina_associada = models.ForeignKey(Disciplina, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = 'Reservas de Ambiente'

    def __str__(self):
        return f"{self.sala_reservada} - {self.dt_inicio} a {self.dt_termino}"