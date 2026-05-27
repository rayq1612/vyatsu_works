def encrypt(text, key):
    if key < 2:
        return text
    
    rails = [[] for _ in range(key)]
    
    rail = 0
    direction = 1
    
    for char in text:
        rails[rail].append(char)
        rail += direction
        
        if rail == key - 1 or rail == 0:
            direction = -direction
    
    result = ''.join(''.join(r) for r in rails)
    return result


def decrypt(ciphertext, key):
    if key < 2:
        return ciphertext
    
    length = len(ciphertext)
    
    pattern = [0] * length
    rail = 0
    direction = 1
    for i in range(length):
        pattern[i] = rail
        rail += direction
        if rail == key - 1 or rail == 0:
            direction = -direction
    
    rail_counts = [0] * key
    for r in pattern:
        rail_counts[r] += 1
    
    rails = []
    pos = 0
    for r in range(key):
        rails.append(list(ciphertext[pos:pos + rail_counts[r]]))
        pos += rail_counts[r]
    
    rail_indices = [0] * key
    result = []
    for i in range(length):
        r = pattern[i]
        result.append(rails[r][rail_indices[r]])
        rail_indices[r] += 1
    
    return ''.join(result)


if __name__ == '__main__':
    print('Шифр "Штакетник"')
    print('1 - шифрование')
    print('2 - дешифрование')
    print('3 - загрузить текст из файла и зашифровать')
    
    choice = input('Выберите действие: ')
    
    if choice == '1':
        text = input('Введите текст: ')
        key = int(input('Введите ключ (число рельсов): '))
        result = encrypt(text, key)
        print(f'Зашифрованный текст: {result}')
    elif choice == '2':
        text = input('Введите зашифрованный текст: ')
        key = int(input('Введите ключ (число рельсов): '))
        result = decrypt(text, key)
        print(f'Расшифрованный текст: {result}')
    elif choice == '3':
        filename = input('Введите имя файла: ')
        with open(filename, 'r', encoding='utf-8') as f:
            text = f.read()
        key = int(input('Введите ключ (число рельсов): '))
        result = encrypt(text, key)
        print(f'Зашифрованный текст: {result}')
    else:
        print('Неизвестная команда')