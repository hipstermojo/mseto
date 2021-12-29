from tortoise.models import Model
from tortoise import fields


class Pack(Model):
    id = fields.UUIDField(pk=True)
    name = fields.CharField(max_length=120)
    description = fields.TextField(null=True)
    created = fields.DatetimeField(auto_now_add=True)
    puzzles: fields.ReverseRelation['Puzzle']

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ['-created']

    class PydanticMeta:
        exclude = ('created',)


class Puzzle(Model):
    id = fields.UUIDField(pk=True)
    name = fields.CharField(max_length=64, null=True)
    created = fields.DatetimeField(auto_now_add=True)
    pack = fields.ForeignKeyField(
        'models.Pack', related_name='puzzles', on_delete=fields.CASCADE)

    def __str__(self) -> str:
        return f"<Puzzle {self.id}>"

    class Meta:
        ordering = ['created']

    class PydanticMeta:
        exclude = ('created',)


class Word(Model):
    text = fields.CharField(pk=True, max_length=64)

    def __str__(self) -> str:
        return self.text


class WordPuzzle(Model):
    puzzle = fields.ForeignKeyField(
        'models.Puzzle', related_name='words', on_delete=fields.CASCADE)
    word = fields.ForeignKeyField(
        'models.Word',  related_name='puzzle', on_delete=fields.CASCADE)
    role = fields.CharField(null=True, max_length=5)
