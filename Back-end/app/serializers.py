from rest_framework import serializers
from .models import Usuario, Disciplina, ReservaAmbiente
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'cargo', 'ni', 'telefone', 'dt_nascimento', 'dt_contratacao']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user

class DisciplinaSerializer(serializers.ModelSerializer):
    professor = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Disciplina
        fields = '__all__'

    def validate(self, value):
        user = self.context['request'].user
        if user.cargo != 'P':
            raise serializers.ValidationError("Apenas professores podem criar disciplinas.")
        return value

class ReservaAmbienteSerializer(serializers.ModelSerializer):
    professor_responsavel = UsuarioSerializer(read_only=True)
    disciplina_associada = DisciplinaSerializer(read_only=True)

    professor_responsavel_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), write_only=True, source='professor_responsavel'
    )
    disciplina_associada_id = serializers.PrimaryKeyRelatedField(
        queryset=Disciplina.objects.all(), write_only=True, source='disciplina_associada'
    )

    class Meta:
        model = ReservaAmbiente
        fields = '__all__'
    
class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['usuario'] = {
            'username': self.user.username,
            'cargo': self.user.cargo
        }
        return data
